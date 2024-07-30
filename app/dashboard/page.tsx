import Documents from "@/components/Documents";

// Always server-side rendered 
export const dynamic = "force-dynamic";

const DashboardPage = () => {
  return (
    <div className="h-full max-w-7xl mx-auto">
      <h1 className="text-3xl p-5 bg-gray-50 font-light text-indigo-600">
        My Documents
      </h1>

      <Documents/>
    </div>
  );
};

export default DashboardPage;
