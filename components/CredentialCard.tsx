import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Eye, Send } from "lucide-react";
import { WalletCredential } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface CredentialCardProps {
  credential: WalletCredential;
  onView: (credential: WalletCredential) => void;
  onPresent: (credential: WalletCredential) => void;
}

const CredentialCard = ({ credential, onView, onPresent }: CredentialCardProps) => {
  const display = credential.parsedDocument;

  return (
    <Card className={`hover:shadow-lg transition-shadow cursor-pointer`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
          {display.type[1] || display.type[0] || "Credential"}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-gray-600">
        <div className="flex gap-2 mb-4 items-center">
          {display.issuer?.image?.id
            ? <img className="w-6 h-6 rounded-lg object-cover" src={display.issuer.image.id} alt={display.issuer.name || "Issuer"} />
            : <Building className="h-4 w-4 mr-1" />}
          <span className="flex-grow">{display.issuer?.name || "No Name"}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
        </div>
        {display.issuanceDate && (
          <div className="text-sm text-gray-500">
            <span>{formatDate(display.issuanceDate)} - {display.expirationDate && formatDate(display.expirationDate)}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onView(credential)} className="flex items-center gap-1 flex-1">
            <Eye className="h-4 w-4" />View Details
          </Button>
          <Button variant="default" size="sm" onClick={() => onPresent(credential)} className="flex items-center gap-1 flex-1">
            <Send className="h-4 w-4" />Present
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CredentialCard;