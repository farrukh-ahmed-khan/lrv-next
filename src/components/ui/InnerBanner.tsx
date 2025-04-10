interface InnerBannerProps {
    title: string;
}


const InnerBanner : React.FC<InnerBannerProps> = ({ title }) => {
  return (
    <section className="inner-wrapper">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="content-wrap">{title && <h4>{title}</h4>}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InnerBanner;
