import Link from "next/link"

const CircleImageLabel = ({ src, alt, label, link }) => {
  return (
    <Link href={`search/${link}`}>
    <div className="flex flex-col items-center mr-2">
      {/* Circle with Image */}
      <div className="w-16 h-16 rounded-full overflow-hidden flex justify-center">
        <img src={src} alt={alt} width={200} height={400} className="object-cover" />
      </div>

      {/* Label */}
      <div className="mt-2 text-center">
        <span className="text-xs font-medium">{label}</span>
      </div>
    </div>
    </Link>
  );
};

export default CircleImageLabel;
