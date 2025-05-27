import React, { useState } from "react";

const LoadingAnimations = ({ loading }:{loading:any}) => {
  const [currentAnimation, setCurrentAnimation] = useState("squares");

  const renderAnimation = () => {
    if (!loading) return null;

    switch (currentAnimation) {
      case "squares":
        return (
          <div className="grid grid-cols-2 gap-1 w-12 h-12">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-5 h-5 bg-[#79B833] rounded-sm squares-animation"
                style={{
                  animationDelay: `${i * 0.1}s`
                }}
              ></div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className=" bg-gradient-to-br justify-center items-center w-full flex p-8">
      <style>
        {`
          @keyframes squares {
            0%, 70%, 100% {
              transform: scale3D(1, 1, 1);
            }
            35% {
              transform: scale3D(0, 0, 1);
            }
          }

          .squares-animation {
            animation: squares 1.2s infinite ease-in-out;
          }
        `}
      </style>

      <div className="flex  flex-col items-center justify-center space-y-6">
        <div className="flex items-center justify-center min-h-24">
          {renderAnimation()}
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimations;
