// "use client";

// import { useState } from "react";
// import { useQuery, useQueryClient } from "react-query";
// import { useRouter } from "next/navigation";
// import { AlertCircle, Check } from "lucide-react";
// import { toast } from "@/components/ui/use-toast";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { AnimatePresence } from "framer-motion";
// import { LoadingPage } from "@/components/LoadingPage";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import axios from 'axios';



// export default function NewSummaryPage() {
//   const [finished, setFinished] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [summary,setSummary]=useState<String>("Generate a summary")
//   const schema = z.object({
//     url: z.string().min(1, { message: "Please paste a YouTube URL" })
//   });

//   const form = useForm<z.infer<typeof schema>>({
//     resolver: zodResolver(schema),
//     defaultValues: {
//       url: ""
//     }
//   });
//   const prompt = "summarize this video in 200 words";
  
//   async function onSubmit(values: z.infer<typeof schema>) {
//     console.log(values.url);
//     const url = values.url;

//     setIsLoading(true);

//     try {
//       const response = await axios.post("/api/chatgpt", {
//         yturl: url,
//         prompt: prompt,
//       });

//       if (response.status !== 200) {
//         throw new Error("Network response was not ok");
//       }

//       const data = response.data;
//       console.log(data.summary);
//       setSummary(data.summary);

//       toast({
//         description: (
//           <p className="flex items-center">
//             <Check className="h-4 w-4 mr-2 " />
//             Summary created successfully.
//           </p>
//         ),
//       });

//       setFinished(true);
//       // router.push(`/summarise/${data.id}`); // Assuming you want to navigate to the summary page
//     } catch (error) {
//       toast({
//         title: "Uh oh, something went wrong!",
//         description: (
//           <p className="flex items-center">
//             <AlertCircle className="h-4 w-4 mr-2" />
//             Oops, there was an error creating the summary. Please try again.
//           </p>
//         ),
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   return (
//     <main className="flex-1 flex-col ml-auto mr-auto p-5 my-6 justify-center items-center relative ">
//       <Card className="w-[500px] p-8 mb-6">
//         <CardHeader>
//           <CardTitle>Generate a YouTube Summary</CardTitle>
//           <CardDescription>
//             Generate a summary of a YouTube video by entering a URL.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)}>
//               <FormField
//                 name="url"
//                 control={form.control}
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Enter the URL</FormLabel>
//                     <FormControl>
//                       <Input placeholder="www.youtube.com/xyz" {...field} />
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />
//               <Button type="submit" className="my-5">Summarize</Button>
//             </form>
//           </Form>
//         </CardContent>
//       </Card>
//       <AnimatePresence>
//         {isLoading && <LoadingPage finished={finished} />}
//       </AnimatePresence>



//       <Card className="w-[500px] p-8">
//         <CardHeader>
//           <CardTitle>Generated Summary</CardTitle>
//           <CardDescription>
//             {summary}
//           </CardDescription>
//         </CardHeader>
        
//       </Card>
//     </main>
//   );
// }



"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnimatePresence } from "framer-motion";
import { LoadingPage } from "@/components/LoadingPage";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function NewSummaryPage() {
  const [finished, setFinished] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [summary, setSummary] = useState<String>("Generate a summary");
  const [embedUrl, setEmbedUrl] = useState("");

  const schema = z.object({
    url: z.string().min(1, { message: "Please paste a YouTube URL" }),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      url: "",
    },
  });
  const prompt = "summarize this video in 200 words";

  function extractVideoId(url: string): string | null {
    const regex = /[?&]v=([^&#]*)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  async function onSubmit(values: z.infer<typeof schema>) {
    console.log(values.url);
    const url = values.url;
    const videoId = extractVideoId(url);
    if (!videoId) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid YouTube URL",
        variant: "destructive",
      });
      return;
    }

    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    setEmbedUrl(embedUrl);

    setIsLoading(true);

    try {
      const response = await axios.post("/api/chatgpt", {
        yturl: url,
        prompt: prompt,
      });

      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }

      const data = response.data;
      console.log(data.summary);
      setSummary(data.summary);

      toast({
        description: (
          <p className="flex items-center">
            <Check className="h-4 w-4 mr-2 " />
            Summary created successfully.
          </p>
        ),
      });

      setFinished(true);
    } catch (error) {
      toast({
        title: "Uh oh, something went wrong!",
        description: (
          <p className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            Oops, there was an error creating the summary. Please try again.
          </p>
        ),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex-1 flex-col ml-auto mr-auto p-5 my-6 justify-center items-center relative ">
      <Card className="w-[700px] p-8 mb-6">
        <CardHeader>
          <CardTitle>Generate a YouTube Summary</CardTitle>
          <CardDescription>
            Generate a summary of a YouTube video by entering a URL.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                name="url"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter the URL</FormLabel>
                    <FormControl>
                      <Input placeholder="www.youtube.com/xyz" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" className="my-5">
                Summarize
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="w-[700px] p-8 mb-10">
        <CardHeader>
          <CardTitle>Video</CardTitle>
          <CardDescription>
            {embedUrl && (
              <iframe
                width="560"
                height="315"
                src={embedUrl}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="w-[700px] p-8">
        <CardHeader>
          <CardTitle>
            Generated Summary
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin justify-center items-center" />
            ) : null}
          </CardTitle>
          <CardDescription>{summary}</CardDescription>
        </CardHeader>
      </Card>
    </main>
  );
}

