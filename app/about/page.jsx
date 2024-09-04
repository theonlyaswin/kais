const AboutUs = () => {
  return (
    <div className="container mx-auto px-4 py-12 my-32 relative">
      {/* Background Illustrations */}
      <div className="absolute inset-0 -z-10 opacity-10">
        <img 
          src="/bag.png" 
          alt="Top Left Illustration"
          className="absolute top-0 left-0 w-1/4"
        />
        <img 
          src="/cart.png" 
          alt="Bottom Right Illustration"
          className="absolute bottom-0 right-0 w-1/4"
        />
      </div>

      {/* Main Heading Section */}
      <section className="text-center mb-16">
        <h2 className="text-2xl text-gray-600 mb-2">Welcome to</h2>
        <h1 className="text-5xl font-bold text-gray-800 mb-6">Kai's Lifestyle Studio</h1>
        
        <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
          At Kai's Lifestyle Studio, we believe in the art of living well. Our studio is not just a space; it's a celebration of life, style, and wellness. Nestled at the intersection of passion and creativity, we curate experiences that go beyond the ordinary.
        </p>
      </section>

      {/* Our Story Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Our Story</h2>
        <p className="text-lg text-gray-600 leading-relaxed text-center max-w-4xl mx-auto">
          Kai's Lifestyle Studio was born from a simple yet powerful idea — to create a haven where lifestyle meets innovation. Founded by a team of visionaries who share a love for design, wellness, and all things beautiful, our studio is a reflection of our commitment to enhancing the quality of life.
        </p>
      </section>

      {/* Essence of Kai Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">The Essence of Kai's</h2>
        <div className="flex justify-center items-center gap-8 text-center">
          <div className="md:w-1/2">
            <p className="text-lg text-gray-600 leading-relaxed">
              Kai's, the heart and soul of our studio, represents more than just a name. It's a philosophy — a celebration of individuality, style, and the pursuit of a balanced, vibrant life. From cutting-edge design to wellness practices that nourish the mind and body, Kai's Lifestyle Studio is a tribute to a lifestyle that embraces the extraordinary.
            </p>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Our Mission</h2>
        <p className="text-lg text-gray-600 leading-relaxed text-center max-w-4xl mx-auto">
          Our mission is to inspire and empower. We aim to redefine the way you experience life by offering a blend of curated products, immersive experiences, and expert guidance. Whether you're seeking to transform your space or enhance your well-being, Kai's Lifestyle Studio is your trusted companion on this exciting journey.
        </p>
      </section>
    </div>
  );
};

export default AboutUs;
