import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Scroll() {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const frameCount = 60;

    const currentFrame = (index) =>
      `/frames/frame_${index.toString().padStart(4, "0")}.png`;

    const images = [];
    const imageSeq = {
      frame: 0,
    };

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i + 1);
      images.push(img);
    }

    images[0].onload = render;

    function render() {
      context.clearRect(0, 0, canvas.width, canvas.height);

      context.drawImage(
        images[imageSeq.frame],
        0,
        0,
        canvas.width,
        canvas.height
      );
    }

    gsap.to(imageSeq, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        scrub: 1,
        pin: true,
        end: "5000",
      },
      onUpdate: render,
    });
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} className="canvas"></canvas>

      <section className="content">
        <h1>Scroll Down</h1>
      </section>
    </div>
  );
}