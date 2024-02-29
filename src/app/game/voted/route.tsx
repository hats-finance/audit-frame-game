import { ImageResponse } from "next/og";
import { config } from "@/config/config";

export const runtime = "experimental-edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const fid = searchParams.get("fid");

  return new ImageResponse(
    (
      <div style={{ display: "flex" }}>
        <img src={`${config.hostURL}/assets/images/home.jpg`} className="img-bg" />
        <p>TEST NONONONONO</p>
      </div>
    ),
    {
      width: 1000,
      height: 1000,
      // fonts: [
      //   {
      //     name: "SchoolBell",
      //     data: schoolBell,
      //     weight: 400,
      //   },
      // ],
    }
  );
}
