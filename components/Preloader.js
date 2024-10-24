import { Progress } from "@/components/ui/progress";

const Preloader = () => {
  return (
    <div className='fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50'>
      <div className='w-64'>
        <Progress value={75} className='h-4' />{" "}
        {/* You can set value dynamically or leave it fixed */}
      </div>
    </div>
  );
};

export default Preloader;
