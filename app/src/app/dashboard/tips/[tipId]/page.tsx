import { type FC } from "react";
import { TipDetailPageContent } from "@/app/dashboard/tips/[tipId]/components/tip-detail-page-content";

const TipDetailPage: FC<{ params: Promise<{ tipId: string }> }> = async ({
  params,
}) => {
  const { tipId } = await params;
  return <TipDetailPageContent tipId={tipId} />;
};

export default TipDetailPage;
