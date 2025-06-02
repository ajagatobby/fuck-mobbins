import { NextRequest, NextResponse } from "next/server";

interface Screen {
  id: string;
  screenUrl: string;
  screenNumber: number;
}

interface ScreensResponse {
  success: boolean;
  screens: Screen[];
  total: number;
  message: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const appSlug = searchParams.get("appSlug");
  const appVersionId = searchParams.get("appVersionId");
  const rsc = searchParams.get("_rsc") || "1"; // Default to "1" if not provided

  console.log(appSlug, appVersionId);
  // Validate required parameters
  if (!appSlug || !appVersionId) {
    return NextResponse.json(
      {
        success: false,
        error: "Missing required parameters: appSlug and appVersionId",
      },
      { status: 400 }
    );
  }

  const cookies =
    "__stripe_mid=c5d3f39d-cddb-4d4b-8454-cd36dd62b47209e111; _fbp=fb.1.1748777976218.67092309304827524; ajs_anonymous_id=120eee89-396b-4ecf-ba77-af1eabe01332; _gcl_au=1.1.12387797.1748777977; _pin_unauth=dWlkPVptWTFZakU1WmpGdE1qVmxNUzAwTXpOaExXRTFNamN0TWpNek1HWXhOakJqTnpsbQ; _gid=GA1.2.1410919176.1748777978; ajs_user_id=2dce8ab6-53b6-4970-8fe5-d3e70ef7a1c2; __stripe_sid=daa54193-b9e8-4310-af4d-5cbe4f6275a8c46626; _derived_epik=dj0yJnU9Q0JlVlFRbEs4b2pwQTg1TVRKWVlwcmQ0RW9LTDhxZlkmbj02bk5SVjRRYUhuSVRicmZSV2FJX1R3Jm09MSZ0PUFBQUFBR2c4VjVNJnJtPTEmcnQ9QUFBQUFHZzhWNU0mc3A9Mg; sb-ujasntkfphywizsdaapi-auth-token.0=%7B%22access_token%22%3A%22eyJhbGciOiJIUzI1NiIsImtpZCI6ImUxb3dtd2dYV216TkhSVUEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3VqYXNudGtmcGh5d2l6c2RhYXBpLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIyZGNlOGFiNi01M2I2LTQ5NzAtOGZlNS1kM2U3MGVmN2ExYzIiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzQ4Nzg4NjQzLCJpYXQiOjE3NDg3ODUwNDMsImVtYWlsIjoiYWphZ2F0b2JieUBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6Imdvb2dsZSIsInByb3ZpZGVycyI6WyJnb29nbGUiXX0sInVzZXJfbWV0YWRhdGEiOnsiYXZhdGFyX3VybCI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0xlN3VEbXdxYmlTVUl1bGpqNUg1cTVEdTd2NzgtbU94WWpEdmYzMk9wY1Y2ZnQ3Y289czk2LWMiLCJlbWFpbCI6ImFqYWdhdG9iYnlAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZ1bGxfbmFtZSI6IkVtbWFudWVsIEFqYWdhIiwiaXNzIjoiaHR0cHM6Ly9hY2NvdW50cy5nb29nbGUuY29tIiwibmFtZSI6IkVtbWFudWVsIEFqYWdhIiwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jTGU3dURtd3FiaVNVSXVsamo1SDVxNUR1N3Y3OC1tT3hZakR2ZjMyT3BjVjZmdDdjbz1zOTYtYyIsInByb3ZpZGVyX2lkIjoiMTEwMDg0ODM5OTc2Mzg5Mjc1MTAyIiwic3ViIjoiMTEwMDg0ODM5OTc2Mzg5Mjc1MTAyIn0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoib2F1dGgiLCJ0aW1lc3RhbXAiOjE3NDg3Nzc5ODl9XSwic2Vzc2lvbl9pZCI6IjA2ZjVlMjhlLWYxY2QtNGRjZi04NjEyLTkxYTc4NmZlOWI4NSIsImlzX2Fub255bW91cyI6ZmFsc2V9.qUpt9oCLBXq0YCDgQRUe05LxmfTdxp97BX6cetobmSQ%22%2C%22token_type%22%3A%22bearer%22%2C%22expires_in%22%3A3600%2C%22expires_at%22%3A1748788643%2C%22refresh_token%22%3A%222lmdn6pvx6vh%22%2C%22user%22%3A%7B%22id%22%3A%222dce8ab6-53b6-4970-8fe5-d3e70ef7a1c2%22%2C%22aud%22%3A%22authenticated%22%2C%22role%22%3A%22authenticated%22%2C%22email%22%3A%22ajagatobby%40gmail.com%22%2C%22email_confirmed_at%22%3A%222024-01-10T22%3A41%3A35.462178Z%22%2C%22phone%22%3A%22%22%2C%22confirmed_at%22%3A%222024-01-10T22%3A41%3A35.462178Z%22%2C%22last_sign_in_at%22%3A%222025-06-01T11%3A39%3A49.166277Z%22%2C%22app_metadata%22%3A%7B%22provider%22%3A%22google%22%2C%22providers%22%3A%5B%22google%22%5D%7D%2C%22user_metadata%22%3A%7B%22avatar_url%22%3A%22https%3A%2F%2Flh3.googleusercontent.com%2Fa%2FACg8ocLe7uDmwqbiSUIuljj5H5q5Du7v78-mOxYjDvf32OpcV6ft7co%3Ds96-c%22%2C%22email%22%3A%22ajagatobby%40gmail.com%22%2C%22email_verified%22%3Atrue%2C%22full_name%22%3A%22Emmanuel%20Ajaga%22%2C%22iss%22%3A%22https%3A%2F%2Faccounts.google.com%22%2C%22name%22%3A%22Emmanuel%20Ajaga%22%2C%22phone_verified%22%3Afalse%2C%22picture%22%3A%22https%3A%2F%2Flh3.googleusercontent.com%2Fa%2FACg8ocLe7uDmwqbiSUIuljj5H5q5Du7v78-mOxYjDvf32OpcV6ft7co%3Ds96-c%22%2C%22provider_id%22%3A%22110084839976389275102%22%2C%22sub%22%3A%22110084839976389275102%22%7D%2C%22identities%22%3A%5B%7B%22identity_id%22%3A%22024e1ba8-ab3a-481b-b5f0-acd4da771d20%22%2C%22id%22%3A%22110084839976389275102%22%2C%22user_id%22%3A%222dce8ab6-53b6-4970-8fe5-d3e70ef7a1c2%22%2C%22identity_data%22%3A%7B%22avatar_url%22%3A%22https%3A%2F%2Flh3.googleusercontent.com%2Fa%2FACg8ocLe7uDmwqbiSUIuljj5H5q5Du7v78-mOxYjDvf32OpcV6ft7co%3Ds96-c%22%2C%22email%22%3A%22ajagatobby%40gmail.com%22%2C%22email_verified%22%3Atrue%2C%22full_name%22%3A%22Emmanuel%20Ajaga%22%2C%22iss%22%3A%22https%3A%2F%2Faccounts.google.com%22%2C%22name%22%3A%22Emmanuel%20Ajaga%22%2C%22phone_v; sb-ujasntkfphywizsdaapi-auth-token.1=erified%22%3Afalse%2C%22picture%22%3A%22https%3A%2F%2Flh3.googleusercontent.com%2Fa%2FACg8ocLe7uDmwqbiSUIuljj5H5q5Du7v78-mOxYjDvf32OpcV6ft7co%3Ds96-c%22%2C%22provider_id%22%3A%22110084839976389275102%22%2C%22sub%22%3A%22110084839976389275102%22%7D%2C%22provider%22%3A%22google%22%2C%22last_sign_in_at%22%3A%222024-01-10T22%3A41%3A35.45921Z%22%2C%22created_at%22%3A%222024-01-10T22%3A41%3A35.459256Z%22%2C%22updated_at%22%3A%222025-06-01T11%3A39%3A48.680648Z%22%2C%22email%22%3A%22ajagatobby%40gmail.com%22%7D%5D%2C%22created_at%22%3A%222024-01-10T22%3A41%3A35.455961Z%22%2C%22updated_at%22%3A%222025-06-01T13%3A37%3A22.865289Z%22%2C%22is_anonymous%22%3Afalse%7D%7D; _ga=GA1.1.227543111.1748777978; _ga_H2L379YHME=GS2.1.s1748777977$o1$g1$t1748785288$j60$l0$h0";

  try {
    const response = await fetch(
      `https://mobbin.com/apps/${appSlug}/${appVersionId}/screens?_rsc=${rsc}`,
      {
        method: "GET",
        headers: {
          Cookie: cookies,
          Rsc: "1",
          "Sec-Ch-Ua-Platform": '"macOS"',
          "Sec-Ch-Ua":
            '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
          "Sec-Ch-Ua-Mobile": "?0",
          "Next-Router-State-Tree":
            "%5B%22%22%2C%7B%22children%22%3A%5B%22(contains-navbar-with-search)%22%2C%7B%22children%22%3A%5B%22apps%22%2C%7B%22children%22%3A%5B%5B%22appSlug%22%2C%22world-app-ios-85bd7e3a-2976-4062-8462-e19e24321e69%22%2C%22d%22%5D%2C%7B%22children%22%3A%5B%5B%22appVersionId%22%2C%22def3011d-3d4b-4df9-9e86-1bce72548156%22%2C%22d%22%5D%2C%7B%22children%22%3A%5B%22__PAGE__%3F%7B%5C%22appSlug%5C%22%3A%5C%22world-app-ios-85bd7e3a-2976-4062-8462-e19e24321e69%5C%22%2C%5C%22appVersionId%5C%22%3A%5C%22def3011d-3d4b-4df9-9e86-1bce72548156%5C%22%7D%22%2C%7B%7D%2C%22%2Fapps%2Fworld-app-ios-85bd7e3a-2976-4062-8462-e19e24321e69%2Fdef3011d-3d4b-4df9-9e86-1bce72548156%22%2C%22refresh%22%5D%7D%5D%7D%5D%7D%5D%2C%22modal%22%3A%5B%22__DEFAULT__%22%2C%7B%7D%5D%7D%5D%7D%2Cnull%2Cnull%2Ctrue%5D",
          Baggage:
            "sentry-environment=production,sentry-release=c5470e2d6bf3a8063d70bd491393f65e14dc0344,sentry-public_key=63305a18ca734bc0a55af2981c0d4d0a,sentry-trace_id=6b6d7f900ae841aebb46863bfa11a291,sentry-org_id=4504042693591040,sentry-sampled=false,sentry-sample_rand=0.6666929651817157,sentry-sample_rate=0.001",
          "Sentry-Trace": "6b6d7f900ae841aebb46863bfa11a291-b80a63a8fbc9cedd-0",
          "Next-Url": `/apps/${appSlug}/${appVersionId}`,
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
          Accept: "*/*",
          "Sec-Fetch-Site": "same-origin",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Dest": "empty",
          Referer: `https://mobbin.com/apps/${appSlug}/${appVersionId}`,
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "en-US,en;q=0.9",
          Priority: "u=1, i",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `Mobbin API returned ${response.status}: ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    const data = await response.text();

    try {
      // Parse RSC format to extract screens
      const lines = data.split("\n");
      let screens: Screen[] = [];

      for (const line of lines) {
        if (line.includes('"screens":[')) {
          try {
            const screenMatches = data.match(/"screenUrl":"https:\/\/[^"]+"/g);
            const idMatches = data.match(/"id":"[^"]+"/g);

            if (screenMatches && idMatches) {
              screens = screenMatches.map((urlMatch, index) => ({
                id:
                  idMatches[index]?.replace('"id":"', "").replace('"', "") ||
                  `screen-${index}`,
                screenUrl: urlMatch
                  .replace('"screenUrl":"', "")
                  .replace('"', ""),
                screenNumber: index + 1, // Start from 1 instead of 0
              }));
            }
            break;
          } catch (parseError) {
            console.error("Error parsing screens:", parseError);
            return NextResponse.json(
              {
                success: false,
                error: "Failed to parse screen data from Mobbin response",
              },
              { status: 500 }
            );
          }
        }
      }

      console.log("screens", screens.length);

      const sortedScreens = screens.sort(
        (a, b) => a.screenNumber - b.screenNumber
      );
      // Return JSON response with screen data
      return NextResponse.json<ScreensResponse>({
        success: true,
        screens: sortedScreens,
        total: screens.length,
        message:
          screens.length > 0
            ? `Found ${screens.length} screens`
            : "No screens found for this app",
      });
    } catch (error) {
      console.error("Error processing Mobbin response:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to process Mobbin response",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error fetching from Mobbin:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch data from Mobbin",
      },
      { status: 500 }
    );
  }
}
