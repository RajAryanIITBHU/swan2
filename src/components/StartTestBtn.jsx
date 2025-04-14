"use client"
import React, { useState } from 'react'
import UntilStartTimer from './UntilStartTimer';
import OpenBankingWindow from "@/components/SecurePopUp";

const StartTestBtn = ({id, startDate, endDate, maxAttempts,userAttempts,rawStartDate}) => {
    const [timeIsClose, setTimeIsClose] = useState(false);
    console.log(timeIsClose,maxAttempts,userAttempts)

  return (
    <div className="flex gap-4 items-center">
      <UntilStartTimer
        start={startDate}
        end={endDate}
        className="p-2 rounded"
        textClassName="font-medium"
        setReached={(e)=>setTimeIsClose(e)}
        tSec={300}
      />
      <OpenBankingWindow
        url={`/test/${id}`}
        isDisabled={parseInt(maxAttempts) <= userAttempts}
        isUserAutherised={
          parseInt(maxAttempts) > userAttempts &&
          timeIsClose
        }
      />
    </div>
  );
}

export default StartTestBtn
