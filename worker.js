const ALLOWED_ORIGIN = "https://SEU-SITE.com";

function corsHeaders(request) {
  const origin = request.headers.get("Origin");

  const allowedOrigin =
    origin === ALLOWED_ORIGIN
      ? origin
      : ALLOWED_ORIGIN;

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}

export default {
  async fetch(request, env) {

    const headers = corsHeaders(request);

    // CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers
      });
    }

    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Method not allowed"
        }),
        {
          status: 405,
          headers: {
            ...headers,
            "Content-Type": "application/json"
          }
        }
      );
    }

    try {

      const data = await request.json();

      const action = data.action;

      let turn;
      let timer = null;

      if (action === "on") {
        turn = "on";
      }

      else if (action === "off") {
        turn = "off";
      }

      else if (action === "timer") {

        turn = "on";

        timer = Number(data.seconds);

        if (
          !Number.isInteger(timer) ||
          timer < 1 ||
          timer > 86400
        ) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Timer must be between 1 and 86400 seconds"
            }),
            {
              status: 400,
              headers: {
                ...headers,
                "Content-Type": "application/json"
              }
            }
          );
        }

      }

      else {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Invalid action"
          }),
          {
            status: 400,
            headers: {
              ...headers,
              "Content-Type": "application/json"
            }
          }
        );
      }

      const params = new URLSearchParams();

      params.set("channel", env.SHELLY_CHANNEL);
      params.set("turn", turn);
      params.set("id", env.SHELLY_DEVICE_ID);
      params.set("auth_key", env.SHELLY_AUTH_KEY);

      if (timer !== null) {
        params.set("timer", timer.toString());
      }

      const response = await fetch(
        env.SHELLY_API_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded"
          },

          body: params.toString()
        }
      );

      const result = await response.text();

      return new Response(
        JSON.stringify({
          success: response.ok,
          action,
          shellyResponse: result
        }),
        {
          status: response.ok ? 200 : 500,
          headers: {
            ...headers,
            "Content-Type": "application/json"
          }
        }
      );

    } catch (error) {

      return new Response(
        JSON.stringify({
          success: false,
          error: error.message
        }),
        {
          status: 500,
          headers: {
            ...headers,
            "Content-Type": "application/json"
          }
        }
      );
    }
  }
};
