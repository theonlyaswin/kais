
const CircleImageLabel = ({ src, alt, label }) => {
  return (
    <div className="flex flex-col items-center mx-8">
      {/* Circle with Image */}
      <div className="w-32 h-32 rounded-full overflow-hidden flex justify-center">
        <img src={src} alt={alt} width={200} height={400} className="object-cover" />
      </div>

      {/* Label */}
      <div className="mt-2 text-center">
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
};

export default CircleImageLabel;
