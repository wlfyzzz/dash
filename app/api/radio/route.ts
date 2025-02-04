import { NextResponse } from 'next/server'
import Axios from 'axios'
function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
export async function GET(req: Request) {
    const radioData = await Axios.get(`https://api.pawtasticradio.net/stats?cache=${getRandomNumber(1,1000000000000)}`)
    const data = radioData.data
    

    return NextResponse.json({ data: (data) })
}
