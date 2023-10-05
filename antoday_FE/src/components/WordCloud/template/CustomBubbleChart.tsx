import { useEffect, useState } from "react";
import styles from "./CustomBubbleChart.module.css";
import BubbleChart from "@weknow/react-bubble-chart-d3";
import axios from "axios";
import { corpDataAtom, wordDataAtom } from "../../../recoil/wordCloud";
import { useRecoilState } from "recoil";

interface WordCloudData {
  label: string;
  value: number;
}

const CustomBubbleChart: React.FC = ({ data }) => {
  const [chartWidth, setChartWidth] = useState(window.innerWidth * (window.innerWidth >= 768 ? 0.65 : 0.75));
  
  // const [words, setWords] = useState<WordCloudData[]>(data);
  // const [corps, setCorps] = useState(null);
  const [words, setWords] = useRecoilState(wordDataAtom);
  const [corps, setCorps] = useRecoilState(corpDataAtom);
  const [mainKeyword, setMainKeyword] = useState(null);
  const [fontSize, setFontSize] = useState(window.innerWidth <= 480 ? 10 : (window.innerWidth >= 1080 ? 20 : 15));
  const bubbleClick = async (label: string) => {
    try {
      const response = await axios.get<WordCloudData[]>(
        import.meta.env.VITE_DATA_API_URL + "/keyword/" + label
      );
      const data = response.data;
      setWords(data.cloud);
      setCorps(data.corps);
      setMainKeyword(label);
    } catch (error) {
      console.error("호출 실패 :", error);
    }
  };

  const updateChartSize = () => {
    setChartWidth(window.innerWidth * (window.innerWidth >= 768 ? 0.65 : 0.75));
    setFontSize(window.innerWidth <= 480 ? 10 : (window.innerWidth >= 1080 ? 20 : 15));
  };

  useEffect(() => {
    window.addEventListener("resize", updateChartSize);
    return () => {
      window.removeEventListener("resize", updateChartSize);
    };
  }, []);

  return (
    <>
      <div className={styles.bubbleChartContainer}>
        {mainKeyword !== null ? (
          <p className={styles.keywordTag}>#{mainKeyword}</p>
        ) : null}
      </div>
      <BubbleChart
        bubbleClickFun={bubbleClick}
        graph={{
          zoom: 0.9,
        }}
        padding={-2.5}
        data={words}
        width={chartWidth}
        height={chartWidth}
        showLegend={false}
        labelFont={{
          size: fontSize,
          color: "#fff",
          weight: "light",
        }}
        valueFont={{
          size: 0,
        }}
      />
    </>
  );
};

export default CustomBubbleChart;
