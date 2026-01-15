'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Container from "./ui/Container";
import Section from "./ui/Section";

const FeatureTopBody = () => {
  return (
    <Section>
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-xl"
          >
            <Image
              src="/AllchainBlod.jpg"
              alt="Blockchain Blood Traceability"
              fill
              className="object-cover"
              priority
            />
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            <h2 className="text-sm font-semibold text-blockchain-600 tracking-wide uppercase">
              Solutions that Adapt & Endure
            </h2>
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
              Powering a new standard for traceability on healthcare sector with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blood-600 to-blockchain-600">
                Blockchain
              </span>
            </h1>
            <p className="text-lg text-gray-600">
              HeroChain is working with experts in the sector to cover real needs
              for all the chain.
            </p>

            <div className="flex flex-wrap gap-4 mt-4">
              <Link href="/get-in-touch">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-blood-600 to-blockchain-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  GET IN TOUCH
                </motion.button>
              </Link>
              <Link href="/company">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 border-2 border-blood-600 text-blood-600 rounded-lg font-semibold hover:bg-blood-50 transition-all duration-200"
                >
                  LEARN MORE
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
};

export default FeatureTopBody;
