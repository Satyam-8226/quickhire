const PageHeader = ({ title, description, cta }) => {
  return (
    <div className="mb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {title}
          </h1>
          <p className="max-w-2xl text-gray-600 leading-7">
            {description}
          </p>
        </div>
        {cta && <div>{cta}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
