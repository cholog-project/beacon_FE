import React, { useRef, useEffect, useState } from "react";
import "./GanttChart.css";

// 날짜 차이를 계산하는 함수 (일수 차이)
const getDaysBetweenDates = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end - start;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // 마지막 날 포함하기 위해 +1
  return diffDays;
};

const GanttChart = ({ tasks }) => {
  const totalDays = 31; // 예시로 31일 (1달) 기준으로 설정
  const startMonth = new Date("2024-10-01"); // 간트 차트 기준 날짜 설정
  const chartRef = useRef(null); // GanttChart 컨테이너 참조
  const [chartWidth, setChartWidth] = useState(0); // GanttChart 컨테이너의 너비 상태

  // 화면 크기에 따라 Gantt 차트 컨테이너 너비를 동적으로 계산
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        setChartWidth(chartRef.current.clientWidth); // Gantt 차트 컨테이너의 실제 너비 가져오기
      }
    };

    handleResize(); // 처음 마운트될 때 크기 설정
    window.addEventListener("resize", handleResize); // 윈도우 크기 변경될 때마다 재계산

    return () => window.removeEventListener("resize", handleResize); // 리스너 제거
  }, []);

  const dayWidth = chartWidth / totalDays; // 하루당 차지하는 너비 계산

  return (
    <div className="gantt-container" ref={chartRef}>
      {/* 날짜 헤더 */}
      <div className="gantt-header">
        {Array.from({ length: totalDays }, (_, i) => (
          <div key={i} className="gantt-day" style={{ width: `${dayWidth}px` }}>
            {i + 1}
          </div>
        ))}
      </div>

      {/* 각 Task의 간트 차트 */}
      {tasks.map((task) => {
        const startDate = new Date(task.planStartDate);
        const endDate = new Date(task.planEndDate);

        // 시작 위치를 월의 첫 날로부터 일 수 차이로 계산 (반올림 처리로 더 정확하게)
        const startDay = Math.max(
          Math.round((startDate - startMonth) / (1000 * 60 * 60 * 24)),
          0
        );
        const taskDuration = getDaysBetweenDates(
          task.planStartDate,
          task.planEndDate
        );

        return (
          <div key={task.id} className="gantt-task-row">
            {/* Task 막대 */}
            <div
              className="gantt-task"
              style={{
                marginLeft: `${startDay * dayWidth}px`, // 시작 날짜에 맞게 위치 조정
                width: `${taskDuration * dayWidth}px`, // Task 기간에 맞게 길이 조정
              }}
            >
              <span className="gantt-task-title">{task.title}</span>

              {/* 각 Do 레코드를 해당 날짜에 표시 */}
              {task.doRecords.map((doRecord) => {
                const doDate = new Date(doRecord.date);

                // Do 날짜가 해당 월의 첫 날(startMonth)과 얼마나 차이 나는지 계산
                const doStartDay = Math.max(
                  Math.round((doDate - startMonth) / (1000 * 60 * 60 * 24)),
                  0
                );

                return (
                  <div
                    key={doRecord.id}
                    className="gantt-do"
                    style={{
                      marginLeft: `${(doStartDay - startDay) * dayWidth * 0.98}px`, // Task 시작일로부터 Do의 차이만큼 이동
                      width: `${dayWidth}px`, // Do 막대는 하루 단위
                    }}
                  >
                    do
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GanttChart;
