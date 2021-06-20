import { MetryApiClient } from "./lib/metriApiClient"
import { writeFileSync } from 'fs'

// Load env variables
require('dotenv').config()

const run = async () => {
    const apiClient = new MetryApiClient()
    const meters = await apiClient.setBoxStatus().setMetric().getMeters()
    console.log('Meters printed in JSON ')
    writeFileSync('meters.json', JSON.stringify(meters))
    console.log(JSON.stringify(meters, null, 2))
}

run()
