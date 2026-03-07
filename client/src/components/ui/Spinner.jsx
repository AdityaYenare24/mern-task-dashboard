const Spinner = ({ size = 'md' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex items-center justify-center">
      <div className={`${sizes[size]} border-2 border-[#2a2f3d] border-t-amber-500 rounded-full animate-spin`} />
    </div>
  );
};

export default Spinner;