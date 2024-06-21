import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { AlertCircle, Check } from "lucide-react";

export async function share(shareData: {
  title: string;
  text: string;
  url: string;
}) {
  try {
    await navigator.share(shareData);
    toast({
      description: (
        <p className="flex items-center">
          <Check className="h-4 w-4" />
          Succesfully shared this page.
        </p>
      ),
    });
  } catch (err) {
    try {
      await navigator.clipboard.writeText(
        `Check out these flashcards on Study AI: ${shareData.url}`,
      );
      toast({
        description: (
          <p className="flex items-center">
            <Check className="h-4 w-4 mr-2" />
            Succesfully copied to the clipboard.
          </p>
        ),
      });
    } catch (e) {
      toast({
        title: "Uh oh, something wen wrong!",
        description: (
          <p className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            There was an error sharing this page.
          </p>
        ),
        variant: "destructive",
        action: (
          <ToastAction altText="Try again" onClick={() => share(shareData)}>
            Try again
          </ToastAction>
        ),
      });
    }
  }
}
