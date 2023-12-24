import { Progress } from "antd";
import React from "react";

const randomColor = () => {
  const arrayOfColorFunctions = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
  ];

  let randomColorString = "#";
  for (let x = 0; x < 6; x++) {
    let index = Math.floor(Math.random() * 16);
    let value = arrayOfColorFunctions[index];
    randomColorString += value;
  }

  return randomColorString;
};

const formateName = (name) => {
  return `${name[0].toUpperCase()}${name.slice(1)}`;
};

export const Stats = ({ data: { stats = [] } = {} }) => {
  const chartData = stats?.map((stat) => {
    const { base_stat = 0, stat: { name = "" } = {} } = stat;
    return { name, value: base_stat, color: randomColor() };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {chartData?.reverse().map(({ name = "", value = 0, color = "" }) => {
        return (
          <div className="stats">
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 400,
                  width: 150,
                }}
                className="stateText"
              >
                {formateName(name)}
              </div>
              <div style={{ marginLeft: 20, marginRight: 20, fontSize: 20 }}>
                {value}
              </div>
            </div>
            <div style={{ width: 200 }}>
              <Progress
                type="line"
                percent={value}
                showInfo={false}
                strokeLinecap="square"
                size={[200, 15]}
                strokeColor={color}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
