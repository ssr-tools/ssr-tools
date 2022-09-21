import hammer from "../images/hammer.jpg";
import { ReactComponent as Tools } from "../images/tools.svg";
import { Print } from "../components/Print";

export const ImagesPage = () => {
  return (
    <>
      <Print text="Images Page" />
      <Tools width={24} height={24} />
      <br />
      <img width={64} height={43} src={hammer} alt="a hammer" />
    </>
  );
};
