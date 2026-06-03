const CategoryCard = ({ className, img, title, children }) => (
    <div className={`group relative rounded-xl overflow-hidden shadow-lg card-hover ${className}`}>
        <img className="w-full h-full object-cover card-img transition-transform duration-700" src={img} alt={title} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        {children}
    </div>
);
export default CategoryCard;