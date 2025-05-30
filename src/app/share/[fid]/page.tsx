import { Metadata } from "next";
import { redirect } from "next/navigation";
import { APP_URL, APP_NAME, APP_DESCRIPTION } from "~/lib/constants";
import { getFrameEmbedMetadata } from "~/lib/utils";
export const revalidate = 300;

interface SharePageProps {
  params: {
    fid: string;
  };
}

export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
  const fid = params.fid;
  const imageUrl = `${APP_URL}/api/opengraph-image?fid=${fid}`;

  return {
    title: `${APP_NAME} - Share`,
    openGraph: {
      title: APP_NAME,
      description: APP_DESCRIPTION,
      images: [imageUrl],
    },
    other: {
      "fc:frame": JSON.stringify(getFrameEmbedMetadata(imageUrl)),
    },
  };
}

export default function Page({ params }: SharePageProps) {
  redirect("/");
  return null;
}// trigger build
