import React, { useState } from "react";
import AtomicPageWrapper from "./searchpage.tsx";
import TokenFetcher from "./TokenFetcher.tsx"; // Import the TokenFetcher component
 
function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
 
  return (
    <>
 
      <div>
        <TokenFetcher onTokenFetched={setAccessToken} />{" "}
        {/* Fetch token and pass it via prop */}
        {accessToken ? (
          <AtomicPageWrapper
            accessToken={accessToken}
            organizationId="pwbmknrr4rtrycvugyuxwfn2fcy"
            pipeline="HE_NexusSearchPipeline"
            searchHub="HE_NexusSearchHub"
          />
        ) : (
          <p></p>
        )}
      </div>
    </>
  );
}
 
export default App;
 
 