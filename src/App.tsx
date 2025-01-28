import React from "react";
import AtomicPageWrapper from "./searchpage.tsx";


function App() {
  return (
    <>
      <div>
        {/* <h1>My coveo search page.</h1> */}
        <AtomicPageWrapper
          accessToken={process.env.REACT_APP_ACCESS_TOKEN || ''}
          organizationId={process.env.REACT_APP_ORGANIZATION_ID || ''}
          pipeline={process.env.REACT_APP_PIPELINE || ''}
          searchHub={process.env.REACT_APP_SEARCH_HUB || ''}
        />
      </div>
    </>
  );
}
export default App;
