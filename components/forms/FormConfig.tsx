"use client";

import { ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { toast } from "../ui/use-toast";
import { cn } from "@/lib/utils";
import { reduceText } from "@/lib/reduce-text";

export function FormConfig({
  onContinue,
  className,
}: {
  onContinue: (text: string) => void | Promise<void>;
  className?: string;
}) {
  const [input, setInput] = useState<string>("");
  const [fileInput, setFileInput] = useState<FileList | null>(null);
  const [tabValue, setTabValue] = useState<string>("upload");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [link, setLink] = useState<string>("");

  async function handleContinue() {
    console.log(tabValue);

    if (tabValue == "upload" && fileInput) {
      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append("file", fileInput[0]);
        const res = await fetch("/api/file", {
          method: "POST",
          body: formData,
        });
        const data = (await res.json()) as string;
        console.log(`Data: ${data}`);
        onContinue(data);
        setIsLoading(false);
        toast({
          description: (
            <p className="flex items-center">
              <Check className="h-4 w-4 mr-2 " />
              Source configured.
            </p>
          ),
        });
        return;
      } catch (e) {
        console.log(e);
        setIsLoading(false);
        toast({
          title: "Uh oh, something went wrong!",
          description: <p>There was parsing your file. Please try again.</p>,
          variant: "destructive",
        });
        return;
      }
    }

    if (tabValue == "link" && link) {
      console.log(link);
      setIsLoading(true);
      try {
        const res = await fetch(`/api/link?link=${link}`);
        const data = await res.json();
        onContinue(data);
        setIsLoading(false);
        toast({
          description: (
            <p className="flex items-center">
              <Check className="h-4 w-4 mr-2 " />
              Source configured.
            </p>
          ),
        });
        return;
      } catch (e) {
        console.log(e);
        setIsLoading(false);
        toast({
          title: "Uh oh, something went wrong!",
          description: <p>There was parsing your link. Please try again.</p>,
          variant: "destructive",
        });
        return;
      }
    }

    if (tabValue == "subject" && input) {
      console.log("foo");
      const reduced = reduceText(input);
      onContinue(reduced);
      toast({
        description: (
          <p className="flex items-center">
            <Check className="h-4 w-4 mr-2 " />
            Source configured.
          </p>
        ),
      });
      return;
    }
  }

  return (
    <Tabs
      value={tabValue}
      onValueChange={(value: string) => setTabValue(value)}
      defaultValue="upload"
      className={cn(className)}
    >
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="upload">Upload</TabsTrigger>
        <TabsTrigger value="subject">Subject</TabsTrigger>
        <TabsTrigger value="link">Link</TabsTrigger>
      </TabsList>
      <TabsContent value="upload">
        <div className="flex flex-col space-y-4 mt-2">
          <div className="space-y-1.5">
            <Input
              type="file"
              accept="text/plain, application/pdf, video/mp4, video/x-m4v, video/*, audio/*"
              onChange={(e) => setFileInput(e.target.files)}
            />
            <p className="text-[0.8rem] text-muted-foreground">
              Upload a plain text, pdf, video, or audio file.
            </p>
          </div>
          <Button className="w-fit" variant="ghost" onClick={handleContinue}>
            Continue{" "}
            {isLoading ? (
              <Loader2 className="h-4 w-4 ml-2 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4 ml-2" />
            )}
          </Button>
        </div>
      </TabsContent>
      <TabsContent value="subject">
        <div className="flex flex-col space-y-2 mt-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[200px] bg-background"
            placeholder="Enter your own subject here (ex: World War II)..."
          />
          <Button className="w-fit" variant="ghost" onClick={handleContinue}>
            Continue{" "}
            {isLoading ? (
              <Loader2 className="h-4 w-4 ml-2 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4 ml-2" />
            )}
          </Button>
        </div>
      </TabsContent>
      <TabsContent value="link">
        <div className="flex flex-col space-y-2 mt-2">
          <Input
            type="url"
            onChange={(e) => setLink(e.target.value)}
            value={link}
            placeholder="Enter source link here..."
          />
          <Button className="w-fit" variant="ghost" onClick={handleContinue}>
            Continue{" "}
            {isLoading ? (
              <Loader2 className="h-4 w-4 ml-2 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4 ml-2" />
            )}
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}
