import React from "react";
import AtomicPageWrapper from "./searchpage.tsx";

function App() {
  return (
    <>
      <div>
        {/* <h1>My coveo search page.</h1> */}
        <AtomicPageWrapper
          accessToken={"xxec3577c4-49fb-4e3c-9b69-da83b08d8289"}
          organizationId={"pwbmknrr4rtrycvugyuxwfn2fcy"}
          pipeline={"GlobalPipeline_test"}
          searchHub={"globalpipelinetest"}
        />
      </div>
    </>
  );
}

export default App;
