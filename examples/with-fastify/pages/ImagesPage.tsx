import hammer from "../images/hammer.jpg";
import { Print } from "../components/Print";

export const ImagesPage = () => {
  return (
    <>
      <Print text="Images Page" />
      <img src={hammer} alt="A hammer" />
    </>
  );
};
