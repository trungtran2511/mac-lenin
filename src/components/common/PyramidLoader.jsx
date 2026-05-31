import "../../styles/common/pyramid-loader.css";

const PyramidLoader = () => {
  return (
    <div className="pyramid-loader" aria-label="Đang tải...">
      <div className="pyramid-wrapper">
        <span className="side side1"></span>
        <span className="side side2"></span>
        <span className="side side3"></span>
        <span className="side side4"></span>
        <span className="shadow"></span>
      </div>
    </div>
  );
};

export default PyramidLoader;
