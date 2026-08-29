import AssistantFab from "@/components/AssistantFab";

export default async function LogementLayout({ children, params }) {
  const { slug } = await params;

  return (
    <>
      {children}
      <AssistantFab slug={slug} />
    </>
  );
}
