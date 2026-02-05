import React from 'react'

import { Timer, TimerReset, TimerOff, LeafyGreen } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip } from "recharts";


const DonutChart = () => {


  const data = [
    { name: "Run Time", value: 513 },
    { name: "Idle Time", value: 36 },
    { name: "Off Time", value: 66 },
  ];

  const COLORS = ["#2e7d32", "#f9a825", "#c62828"];

  return (
    <>

      <div className='flex w-full mt-5 gap-x-5 '>
        <div className='items-center justify-between min-w-[240px['>
          <div className='flex-col space-y-3 '>
            <div className='bg-white flex items-center gap-x-4 p-2 rounded-lg'>
              <div><Timer size={48} strokeWidth={3} color="#2E7D32" /></div>
              <div className='flex-col text-sm'>
                <div className='font-semibold'>Run</div>
                <div className='font-semibold'>Time</div>
              </div>
              <div className='text-[#2E7D32] font-bold text-3xl'>513 Minutes</div>
            </div>
            <div className='bg-white flex items-center gap-x-4 p-2 rounded-lg'>
              <div><TimerReset size={48} strokeWidth={3} color="#F9A825" /></div>
              <div className='flex-col text-sm'>
                <div className='font-semibold'>Idle</div>
                <div className='font-semibold'>Time</div>
              </div>
              <div className='text-[#F9A825] font-bold text-3xl'>66 Minutes</div>
            </div>
            <div className='bg-white flex items-center gap-x-4 p-2 rounded-lg'>
              <div><TimerOff size={48} strokeWidth={3} color="#C62828" /></div>
              <div className='flex-col text-sm'>
                <div className='font-semibold'>Off</div>
                <div className='font-semibold'>Time</div>
              </div>
              <div className='text-[#C62828] font-bold text-3xl'>66 Minutes</div>
            </div>
          </div>
        </div>
        <div>
          <div className='bg-white'>
            <div><PieChart width={250} height={250}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                cornerRadius={10}  
                paddingAngle={3}
              >
                <text x="50%" y="45%" textAnchor="middle" fontSize={14}>
                  Total
                </text>
                <text x="50%" y="55%" textAnchor="middle" fontSize={24} fontWeight="bold">
                  615
                </text>
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart></div>

            <div>
              <div></div>
            </div>


          </div>

        </div>
      </div>

    </>
  )
}

export default DonutChart