export namespace Metry {

    export type ConsumptionType = 'electricity' | 'heat' | 'cooling' | 'gas' | 'hot_water' | 'water' | 'sensor'

    export type MetricType = 'energy' | 'flow' | 'energy_hightariff' | 'energy_lowtariff' | 'temperature' | 'return_temperature' | 'supply_temperature' | 'tvoc' | 'co2'

    export enum MeterBoxStatus {
        INBOX = 'inbox',
        IGNORED = 'ignored',
        ACTIVE = 'active',
        TEMPORARY = 'temporary'
    }

    export interface Meter {
        _id: string
        ean: string
        revoked: boolean
        box: MeterBoxStatus
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
           } & { [key:string]: Array<number>}>
       }>
    }

    export interface MeterListItem {
        _id: string
        ean: string
        consumption: {
            timeStamp: string
            value: number
        } | null
    }

    export type MeterListResult = Array<MeterListItem>

    export type GranularityType = 'month' | 'day' | 'hour'

    export interface MeterFilter {
        skip: number | null
        box: MeterBoxStatus | null
        metrics: MetricType
    }

    export enum PeriodFormats {
        YEAR = 'yyyy',
        YEAR_MONTH = 'yyyymm',
        YEAR_MONTH_DAY = 'yyyymmdd',
        YEAR_MONTH_DAY_HOUR = 'yyyymmddhh'
    }

    type Period = {
        date: Date
        format: PeriodFormats
    }

    export interface ConsumptionPeriod {
        start: Period
        end?: Period
    }

    export interface ConsumptionFilter {
        period: ConsumptionPeriod | null
        metrics: MetricType
        granularity: GranularityType | null
    }


    export interface IMetriApiClient {
        getMeters(): Promise<MeterListResult>
        getConsumption(meterId: string): Promise<Consumption>  
    }

    export interface IFilterAble {
        setMetric(metric: MetricType): ThisType<IMetriApiClient>
        setSkip(skip: number): ThisType<IMetriApiClient>
        setBoxStatus(status: MeterBoxStatus): ThisType<IMetriApiClient>
        setConsumptionPeriod(period: ConsumptionPeriod): ThisType<IMetriApiClient>
        setGranularity(granularity: GranularityType): ThisType<IMetriApiClient>
    }
}