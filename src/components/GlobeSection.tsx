"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { initGSAP } from "@/lib/gsap";

const createPointOnSphere = (radius: number) => {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);

  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
};

const createNetworkLineGeometry = (radius: number, pointCount: number) => {
  const points = Array.from({ length: pointCount }, () => createPointOnSphere(radius));
  const positions: number[] = [];

  points.forEach((point, index) => {
    points
      .filter((_, pointIndex) => pointIndex !== index)
      .sort((a, b) => point.distanceTo(a) - point.distanceTo(b))
      .slice(0, 3)
      .forEach((neighbor) => {
        positions.push(
          point.x,
          point.y,
          point.z,
          neighbor.x,
          neighbor.y,
          neighbor.z,
        );
      });
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  return geometry;
};

type Disposable = {
  dispose: () => void;
};

const isDisposable = (value: unknown): value is Disposable => {
  return (
    typeof value === "object" &&
    value !== null &&
    "dispose" in value &&
    typeof (value as Disposable).dispose === "function"
  );
};

const disposeMaterial = (material: unknown) => {
  const materials = Array.isArray(material) ? material : [material];
  materials.forEach((instance) => {
    if (isDisposable(instance)) {
      instance.dispose();
    }
  });
};

export default function GlobeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { gsap } = initGSAP();
    const section = sectionRef.current;
    const mount = mountRef.current;
    if (!section || !mount) {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      42,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0.2, 4.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const globeGeometry = new THREE.SphereGeometry(1.35, 64, 64);
    const globeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x6a9dff,
      roughness: 0.2,
      metalness: 0.18,
      transmission: 0.23,
      transparent: true,
      opacity: 0.84,
      clearcoat: 0.9,
      clearcoatRoughness: 0.22,
      emissive: 0x173764,
      emissiveIntensity: 0.2,
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    globeGroup.add(globe);

    const wireGeometry = new THREE.WireframeGeometry(
      new THREE.SphereGeometry(1.38, 36, 36),
    );
    const wireMaterial = new THREE.LineBasicMaterial({
      color: 0x8eb9ff,
      transparent: true,
      opacity: 0.33,
    });
    const wireframe = new THREE.LineSegments(wireGeometry, wireMaterial);
    globeGroup.add(wireframe);

    const networkGeometry = createNetworkLineGeometry(1.42, 56);
    const networkMaterial = new THREE.LineBasicMaterial({
      color: 0x9ac1ff,
      transparent: true,
      opacity: 0.24,
    });
    const networkLines = new THREE.LineSegments(networkGeometry, networkMaterial);
    globeGroup.add(networkLines);

    const starsGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(900);
    for (let i = 0; i < starPositions.length; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 18;
      starPositions[i + 1] = (Math.random() - 0.5) * 12;
      starPositions[i + 2] = -4 - Math.random() * 8;
    }
    starsGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xe7efff,
      size: 0.03,
      transparent: true,
      opacity: 0.72,
    });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    scene.add(new THREE.AmbientLight(0xcdd9ff, 0.78));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.05);
    keyLight.position.set(2, 3, 4);
    scene.add(keyLight);

    const clock = new THREE.Clock();
    let animationFrame = 0;

    const render = () => {
      animationFrame = window.requestAnimationFrame(render);
      const elapsed = clock.getElapsedTime();
      globeGroup.rotation.y += 0.0018;
      globeGroup.rotation.x = Math.sin(elapsed * 0.32) * 0.08;
      wireframe.rotation.y -= 0.0008;
      renderer.render(scene, camera);
    };
    render();

    const resize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", resize);

    const context = gsap.context(() => {
      gsap.to(globeGroup.rotation, {
        y: "+=1.8",
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.fromTo(
        "[data-globe-reveal]",
        { y: 26, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.11,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 72%",
            once: true,
          },
        },
      );
    }, section);

    return () => {
      context.revert();
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);

      globeGeometry.dispose();
      wireGeometry.dispose();
      networkGeometry.dispose();
      starsGeometry.dispose();
      disposeMaterial(globeMaterial);
      disposeMaterial(wireMaterial);
      disposeMaterial(networkMaterial);
      disposeMaterial(starsMaterial);

      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32">
      <div className="section-shell grid items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p
            data-globe-reveal
            className="mb-4 text-xs font-semibold tracking-[0.26em] text-signal uppercase"
          >
            Global Presence
          </p>
          <h2
            data-globe-reveal
            className="display-title text-4xl font-semibold text-pearl md:text-5xl"
          >
            Crafted for Roads Across Five Continents
          </h2>
          <p
            data-globe-reveal
            className="mt-5 max-w-lg text-sm leading-relaxed text-mist/90 md:text-base"
          >
            Aurora Motors operates private delivery and concierge service centers in
            London, Dubai, Singapore, Monaco, and Los Angeles.
          </p>
          <div data-globe-reveal className="mt-8 flex flex-wrap gap-3 text-xs">
            {["Monaco", "Dubai", "Singapore", "London", "Los Angeles"].map((city) => (
              <span
                key={city}
                className="rounded-full border border-signal/30 bg-signal/10 px-4 py-2 tracking-[0.14em] text-signal uppercase"
              >
                {city}
              </span>
            ))}
          </div>
        </div>

        <div className="premium-border relative h-[360px] overflow-hidden rounded-3xl md:h-[500px]">
          <div ref={mountRef} className="h-full w-full" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
        </div>
      </div>
    </section>
  );
}
