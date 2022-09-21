import hammer from "../images/hammer/hammer.jpg";
import { Print } from "../components/Print";

export const ImagesPage = () => {
  return (
    <>
      <Print text="Images Page" />
      <img width={640} height={427} src={hammer} alt="a hammer" />
    </>
  );
};
