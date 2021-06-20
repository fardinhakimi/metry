import fetch from 'node-fetch'
import { MetriApiError } from './exceptions'

export class MetryApiClient implements Metry.IMetriApiClient, Metry.IFilterAble {

    private BASE_URl: string 
    private TOKEN: string
    private meterFilterParams: Metry.MeterFilter = {
        skip: null,
        box: null,
        metrics: null
    }

    private consumptionParams: Metry.ConsumptionFilter = {
        period: null,
        metrics: null,
        granularity: null,
    }

    constructor() {
        if(!process.env.METRI_API_URL || !process.env.METRI_API_TOKEN) {
            throw new Error('METRI_API_URL and METRI_API_TOKEN must be provided to connect to Metri Api')
        }
        this.BASE_URl = process.env.METRI_API_URL
        this.TOKEN = process.env.METRI_API_TOKEN
    }

    setMetric(metric: Metry.MetricType = 'energy'): MetryApiClient {
        this.meterFilterParams.metrics = metric
        this.consumptionParams.metrics = metric
        return this
    }
    setSkip(skip: number): MetryApiClient {
        this.meterFilterParams.skip = skip
        throw new Error("Method not implemented.")
    }
    setBoxStatus(status: Metry.MeterActiveStatus = 'active'): MetryApiClient {
        this.meterFilterParams.box = status
        return this
    }
    setConsumptionPeriod(period: Metry.ConsumptionPeriod): MetryApiClient {
        this.consumptionParams.period = period
        return this
    }

    setGranularity(granularity: Metry.GranularityType): MetryApiClient {
        this.consumptionParams.granularity = granularity
        return this
    }
    private getMeterQueryString() {
        let queryStr = ''

        for( const [key, value] of Object.entries(this.meterFilterParams)) {
            const separator = queryStr === '' ? '?' : '&'
            queryStr += `${separator}${key}=${value}`
        }
        return queryStr
    }

    async getMeters(): Promise<Metry.MeterListResult> {

        try {
            
            const response = await fetch(`${this.BASE_URl}/meters${this.getMeterQueryString()}`, {
                headers: {
                    Authorization: `Bearer ${this.TOKEN}`
                }
            })

            if(!response.ok) {
                throw new MetriApiError(response.statusText, response.status)
            }

            const meterList: Metry.ApiMeterListResult = await response.json()

            console.log(`Metry Api results`)
            console.log(meterList)

            const results = await Promise.all( meterList.data.map( async (meter): Promise<Metry.MeterListItem> => {

                try {

                    const consumption = await this.getConsumption(meter._id)

                    return {
                        _id: meter._id,
                        ean: meter.ean,
                        consumption: null
                    }

                    
                } catch (error) {

                    return {
                        _id: meter._id,
                        ean: meter.ean,
                        consumption: null
                    }
                }

            })) 
        
            return results

            
        } catch (error) {
            
        }
    }
    async getConsumption(meterId: string): Promise<Metry.Consumption> {

        if(!meterId || !this.consumptionParams.period || !this.consumptionParams.granularity) {
            throw new Error('MeterId, period and granularity is required to get a meaninful consumption')
        }
        const { granularity, period, metrics} = this.consumptionParams

        const periodStr = period.end ? `${period.start}-${period.end}` : period.end

        const response = await fetch(`${this.BASE_URl}/consumptions/${meterId}/${granularity}/${periodStr}?metrics=${metrics}`)

        if(!response.ok) {
            throw new MetriApiError(response.statusText, response.status)
        }

        const result: Metry.Consumption = await response.json()

        console.log(`Consumption data for meter(${meterId})`)

        return result
    }
}