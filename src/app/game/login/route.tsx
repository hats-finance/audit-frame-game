import { ImageResponse } from "next/og";
import { config } from "@/config/config";
import { ICompetitionData } from "@/data/models";
import { ipfsTransformUri } from "@/helpers/ipfsTransformUri";

export const runtime = "experimental-edge";

export async function GET(request: Request) {
  const IBMPlexMono = await fetch(new URL("/public/assets/IBMPlexMono-Regular.ttf", import.meta.url)).then((res) =>
    res.arrayBuffer()
  );
  const IBMPlexSansBold = await fetch(new URL("/public/assets//IBMPlexSans-Bold.ttf", import.meta.url)).then((res) =>
    res.arrayBuffer()
  );

  const { searchParams } = new URL(request.url);

  const competitionData = searchParams.get("competition");
  const competition = JSON.parse(competitionData || "null") as ICompetitionData | undefined;

  return new ImageResponse(
    (
      <div style={{ display: "flex", position: "relative", width: 1000, height: 1000, justifyContent: "center" }}>
        <img
          style={{ position: "absolute", top: 0, left: 0, width: 1000, height: 1000 }}
          src={`${config.hostURL}/assets/images/start.jpg`}
        />

        {/* COMPETITION DETAILS */}
        {!!competition && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "absolute",
              top: "8%",
              left: "50%",
              transform: "translateX(-50%)",
            }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={ipfsTransformUri(competition?.logo)} alt={competition?.name} width={100} height={100} />
              {/* <img src={`${config.hostURL}/assets/images/placeholder.svg`} alt={competition?.name} width={100} height={100} /> */}
              <p style={{ color: "white", fontSize: "28px", marginLeft: "20px" }}>{competition?.name}</p>
            </div>
          </div>
        )}
      </div>
    ),
    {
      width: 1000,
      height: 1000,
      fonts: [
        {
          name: "IBMPlexMono",
          data: IBMPlexMono,
          weight: 400,
        },
        {
          name: "IBMPlexSansBold",
          data: IBMPlexSansBold,
          weight: 700,
        },
      ],
    }
  );
}
