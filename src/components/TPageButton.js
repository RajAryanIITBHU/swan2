import React from 'react'
import UntilStartTimer from './UntilStartTimer';
import OpenBankingWindow from "@/components/SecurePopUp";

const TPageButton = () => {
  return (
    <div>
      <UntilStartTimer
        className={"test-xs px-2 py-1 font-medium rounded-lg"}
        start={data.startDate}
        end={data.endDate}
      />
      <OpenBankingWindow
        url={`/test/${id}`}
        isDisabled={data?.raw?.attempts <= userGivenNoOfTests}
        isUserAutherised={
          data?.raw?.attempts > userGivenNoOfTests &&
          new Date(data.raw.startDate) - new Date() < 5 * 60 * 1000
        }
      />
    </div>
  );
}

export default TPageButton
