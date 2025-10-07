import React from "react";
import { Col } from "reactstrap";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
// import authOverlay from "../../assets/images/mytool.jpg";

const CarouselPage = () => {
  return (
    <Col lg={8} md={7} className="d-none d-md-block">
      <div className="auth-full-bg">
        <div className="bg-overlay" style={{
          //  background: `url(${authOverlay})`, 
        
        backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center" }}></div>
        <div className="d-flex h-100 flex-column">
          <div className="mt-auto p-4">
            <div className="text-center text-white">
              <h4 className="mb-3">
                <i className="bx bxs-quote-alt-left text-primary h1 align-middle me-3"></i>
                <span className="text-danger">5k</span>+ Satisfied Clients
              </h4>
              <Carousel showThumbs={false} showStatus={false} className="auth-review-carousel">
                <div className="item">
                  <div className="pb-5 pt-3">
                    <p className="font-size-16 mb-4">
                      &quot;Fantastic theme with a ton of options. Highly recommend!&quot;
                    </p>
                    <h4 className="font-size-16 text-primary">Abs1981</h4>
                    <p className="font-size-14 mb-0">- mc User</p>
                  </div>
                </div>
                <div className="item">
                  <div className="pb-5 pt-3">
                    <p className="font-size-16 mb-4">
                      &quot;Great support and features. Keep up the good work!&quot;
                    </p>
                    <h4 className="font-size-16 text-primary">Abs1981</h4>
                    <p className="font-size-14 mb-0">- mc User</p>
                  </div>
                </div>
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </Col>
  );
};

export default CarouselPage