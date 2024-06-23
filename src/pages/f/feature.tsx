// src/pages/f/[feature].tsx
import type { NextPage } from "next";
import { useState, useEffect } from "react"; // Add suspense when we're ready
import { useRouter } from "next/router";
import EmployeeView from "../views/Employee";
// import { Loading } from "@/components/prototype/Loading";

const FeaturePage: NextPage = () => {
  const router = useRouter();
  const [feature, setFeature] = useState<string | null>(null);

  useEffect(() => {
    if (router.isReady) {
      const featureId = router.query.feature as string;
      setFeature(featureId);
      console.log("feature set", featureId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  return <div>{feature == "employees" && <EmployeeView />}</div>;
};

export default FeaturePage;
