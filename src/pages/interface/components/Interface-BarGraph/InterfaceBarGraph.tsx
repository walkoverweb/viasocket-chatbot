// eslint-disable-next-line import/no-unresolved
import React from "react";
// import/no-extraneous-dependencies
import { ResponsiveBar } from "@nivo/bar";

interface InterfaceBarGraphProps {
  props?: any;
}

function InterfaceBarGraph({ props }: InterfaceBarGraphProps) {
  const data = [
    {
      country: "AD",
      "hot dog": 175,
      burger: 184,
      sandwich: 161,
      kebab: 77,
      fries: 162,
      donut: 172,
    },
    {
      country: "AE",
      "hot dog": 59,
      burger: 16,
      sandwich: 97,
      kebab: 173,
      fries: 21,
      donut: 190,
    },
    {
      country: "AF",
      "hot dog": 57,
      burger: 193,
      sandwich: 82,
      kebab: 144,
      fries: 171,
      donut: 150,
    },
    {
      country: "AG",
      "hot dog": 69,
      burger: 24,
      sandwich: 53,
      kebab: 38,
      fries: 45,
      donut: 42,
    },
  ];
  const keys = ["hot dog", "burger", "sandwich", "kebab", "fries", "donut"];
  return (
    <div style={{ width: "fit-content", minWidth: "450px", height: "500px" }}>
      <ResponsiveBar
        data={props?.data || data}
        keys={props?.keys || keys}
        indexBy={props?.key || props?.indexBy || "country"}
        margin={{ top: 20, right: 100, bottom: 40, left: 50 }}
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={{ scheme: "set3" }}
        borderColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendPosition: "middle",
          legendOffset: 32,
          truncateTickAt: 0,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "food",
          legendPosition: "middle",
          legendOffset: -40,
          truncateTickAt: 0,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ theme: "background" }}
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: "left-to-right",
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: "hover",
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        role="application"
        ariaLabel="Nivo bar chart demo"
        barAriaLabel={(e) =>
          `${e.id}: ${e.formattedValue} in country: ${e.indexValue}`
        }
      />
    </div>
    // <h1>hello</h1>
  );
}

export default InterfaceBarGraph;
