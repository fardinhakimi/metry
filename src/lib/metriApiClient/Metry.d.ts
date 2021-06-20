
declare namespace Metry {

    export type ConsumptionType = 'electricity' | 'heat' | 'cooling' | 'gas' | 'hot_water' | 'water' | 'sensor'

    export type MetricType = 'energy' | 'flow' | 'energy_hightariff' | 'energy_lowtariff' | 'temperature' | 'return_temperature' | 'supply_temperature' | 'tvoc' | 'co2'

    export type MeterActiveStatus = 'inbox' | 'ignored' | 'active' | 'temporary'

    export interface Meter {
        _id: string
        ean: string
        revoked: boolean
        on_hold: boolean
        box: MeterActiveStatus
        type: ConsumptionType
        metrics: Array<MetricType>
    }

    export interface ApiMeterListResult {
        skip: number
        limit: number
        count: number
        data: Array<Meter>
    }

    export interface Consumption {
       data: Array<{
           meter_id: string,
           periods: Array<{
               start_date: string
               end_date: string
           }>
       }>
    }

    export interface MeterListItem {
        _id: string
        ean: string
        consumption: {
            timeStamp: string
            value: Array<number>
        } | null
    }

    export type MeterListResult = Array<MeterListItem>

    export interface ConsumptionPeriod {
        start: string
        end?: string
    }

    export type GranularityType = 'month' | 'day' | 'hour'


    export interface MeterFilter {
        skip: number | null
        box: MeterActiveStatus | null
        metrics: MetricType | null
    }

    export interface ConsumptionFilter {
        period: ConsumptionPeriod | null
        metrics: MetricType | null
        granularity: GranularityType | null
    }

    export interface IMetriApiClient {
        getMeters(): Promise<MeterListResult>
        getConsumption(meterId: string): Promise<Consumption>  
    }

    export interface IFilterAble {
        setMetric(metric: MetricType): ThisType<IMetriApiClient>
        setSkip(skip: number): ThisType<IMetriApiClient>
        setBoxStatus(status: MeterActiveStatus): ThisType<IMetriApiClient>
        setConsumptionPeriod(period: ConsumptionPeriod): ThisType<IMetriApiClient>
        setGranularity(granularity: GranularityType): ThisType<IMetriApiClient>
    }
}
