import React from 'react'

import { Timer, TimerReset, TimerOff, LeafyGreen } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip } from "recharts";


const DonutChart = () => {


  const data = [
    { name: "Run Time", value: 513 },
    { name: "Idle Time", value: 36 },
    { name: "Off Time", value: 66 },
  ];

  const COLORS = ["#0abf34", "#f5b42a", "#c62828"];

  return (
    <>

      <div className='flex w-full mt-5 gap-x-5 justify-between '>
        <div className='mx-auto items-center  justify-between  '>
          <div className='flex-col space-y-3 '>
            <div className='bg-white  flex items-center gap-x-4 p-2 rounded-lg'>
              <div><Timer size={48} strokeWidth={3} color="#0abf34" /></div>
              <div className='flex-col text-sm text-gray-500'>
                <div className='font-semibold'>Run</div>
                <div className='font-semibold'>Time</div>
              </div>
              <div className='text-[#0abf34] font-bold text-3xl'>513 minutes</div>
            </div>
            <div className='bg-white flex items-center gap-x-4 p-2 rounded-lg'>
              <div><TimerReset size={48} strokeWidth={3} color="#F9A825" /></div>
              <div className='flex-col text-sm text-gray-500'>
                <div className='font-semibold'>Idle</div>
                <div className='font-semibold'>Time</div>
              </div>
              <div className='text-[#F9A825] font-bold text-3xl'>66 minutes</div>
            </div>
            <div className='bg-white flex items-center gap-x-4 p-2 rounded-lg'>
              <div><TimerOff size={48} strokeWidth={3} color="#e0282f" /></div>
              <div className='flex-col text-sm text-gray-500'>
                <div className='font-semibold'>Off</div>
                <div className='font-semibold'>Time</div>
              </div>
              <div className='text-[#e0282f] font-bold text-3xl'>66 minutes</div>
            </div>
          </div>
        </div>
        <div className='mx-auto'>
          <div className='bg-white flex-col text-center px-20'>
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
                <text x="50%" y="45%" textAnchor="middle" fontSize={14} fill='gray'>
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
              <div className='flex gap-x-3'>
                <div className='flex-col text-center'>
                  <div className='flex items-center'>
                    <p className='w-2 h-2 mx-2 bg-[#0abf34] rounded-full'></p>
                    <p className='text-xs text-gray-500'>Run Time</p>
                  </div>
                  <div className='font-semibold'>33</div>
                </div>
                <div className='flex-col text-center'>
                  <div className='flex items-center'>
                    <p className='w-2 h-2 mx-2 bg-[#f5b42a] rounded-full'></p>
                    <p className='text-xs text-gray-500'>Run Time</p>
                  </div>
                  <div className='font-semibold'>33</div>
                </div>
                <div className='flex-col text-center'>
                  <div className='flex items-center'>
                    <p className='w-2 h-2 mx-2 bg-[#c62828] rounded-full'></p>
                  <p className='text-xs text-gray-500'>Off Time</p>
                  </div>
                  <div className='font-semibold'>33</div>
                </div>
              </div>
            </div>


          </div>

        </div>
      </div>

    </>
  )
}

export default DonutChart