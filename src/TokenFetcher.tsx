import React, { useEffect } from "react";

interface TokenFetcherProps {
  onTokenFetched: (token: string) => void;
}

const TokenFetcher: React.FC<TokenFetcherProps> = ({ onTokenFetched }) => {
  useEffect(() => {
    async function fetchToken() {
      try {
        const response = await fetch(
          "https://pwbmknrr4rtrycvugyuxwfn2fcy.org.coveo.com/rest/search/v2/token?organizationId=pwbmknrr4rtrycvugyuxwfn2fcy",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer xxc49a46e4-dfdb-4fca-b771-d5218e6fc744",
            },
            body: JSON.stringify({
              userIds: [
                {
                  name: "asmith@example.com",
                  provider: "Email Security Provider",
                  type: "User",
                },
              ],
            }),
          }
        );

        const data = await response.json();
        if (data.token) {
          onTokenFetched(data.token); // Pass the token to the parent via props
        } else {
          console.error("Failed to get access token");
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    }

    fetchToken();
  }, [onTokenFetched]);

  return <></>;
};

export default TokenFetcher;