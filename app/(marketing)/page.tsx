import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cards, faq, featuresPara, mission, plans } from "@/config/marketing";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  return (
    <div className="flex flex-col">
      <main className="p-10 flex-1 mx-auto max-w-4xl md:max-w-6xl flex flex-col space-y-52 pt-24">
        <div className="flex flex-col space-y-4 items-center text-center">
          <div className="rounded-full border text-xs font-medium px-6 py-1.5">
            {siteConfig.version} Live Now
          </div>
          <h1 className="font-extrabold text-4xl lg:text-5xl xl:text-6xl tracking-tight">
            Helping Students Study Better Using AI
          </h1>
          <p className="leading-normal text-muted-foreground sm:text-xl sm:leading-8 font-medium max-w-[42rem]">
            {siteConfig.description}
          </p>
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button className="p-6 text-base">Get Started</Button>
            </Link>{" "}
            <Link href="/signup">
              <Button variant="outline" className="p-6 text-base">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col space-y-8 items-center">
          <div className="space-y-4 text-center">
            <h1 className="font-extrabold text-4xl lg:text-5xl xl:text-6xl tracking-tight">
              Features
            </h1>
            <p className="leading-normal text-muted-foreground sm:text-xl sm:leading-8 font-medium max-w-[42rem]">
              {featuresPara}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {cards.map((card) => (
              <Card key={uuidv4()}>
                <CardHeader>
                  <div className="pb-4">{card.icon}</div>
                  <CardTitle>{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
