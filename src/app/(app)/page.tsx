"use client";
import { Boxes } from "@/components/ui/background-boxes";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

import messages from "@/messages.json";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <main className="bg-black overflow-hidden relative min-h-screen flex-grow text-white w-full flex flex-col items-center p-8 md:p-12">
      <Boxes />
      <div className="container mx-auto space-y-12 z-20">
        <section className=" text-center">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the world of Anonymous Conversation
          </h1>
          <p className="text-base md:text-lg mt-3 md:mt-4">
            Explore Mystery Message - where your identitfy remains a secret.
          </p>
        </section>
        <div>
          <Carousel
            plugins={[Autoplay({ delay: 2000 })]}
            className="w-full max-w-3xl mx-auto"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card className=" bg-black text-white border border-white">
                      <CardHeader>
                        {message.title}
                      </CardHeader>
                      <Separator />
                      <CardContent className="flex items-center justify-center w-full max-h-20 h-max p-5">
                        {message.content}
                      </CardContent>
                      <CardFooter className="text-neutral-400">
                        {message.received}
                      </CardFooter>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </main>
  );
}
