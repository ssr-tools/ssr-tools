import { Print } from "../components/Print";
import { useStaticData } from "../config/staticDataStore";

export const StaticDataPage = () => {
  const staticData = useStaticData();
  return (
    <>
      <Print text="Static data" />
      {staticData.texts.map((t) => (
        <p key={t}>{t}</p>
      ))}
    </>
  );
};
