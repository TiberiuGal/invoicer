package invoicer

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/drive/v3"
	"google.golang.org/api/option"
)

const (
	invoiceFolderID = "1rPbqBxpamR4tNr_xN2WBXcXmLa2GeRdo"
)

func SetupGDrive(credentialsFile string) (*drive.Service, error) {
	gcredentials, err := os.ReadFile("credentials.json")
	if err != nil {
		log.Printf("Unable to read client secret file: %v\n", err)
		return nil, err
	}
	// If modifying these scopes, delete your previously saved token.json.
	gconfig, err := google.ConfigFromJSON(gcredentials, drive.DriveScope)
	if err != nil {
		log.Fatalf("Unable to parse client secret file to config: %v", err)
		return nil, err
	}
	log.Println("got config object")
	gDriveClient := getClient(gconfig)
	log.Println("got client, setting up service")
	return drive.NewService(context.Background(), option.WithHTTPClient(gDriveClient))
}

// upload file to google drive
func HandleFileUpload(invoiceUpload *InvoiceUpload, gDriveService *drive.Service) error {
	// check if folder exists
	res, err := gDriveService.Files.List().Q(fmt.Sprintf("'%s' in parents and name = '%s' ", invoiceFolderID, invoiceUpload.Month)).Do()
	if err != nil {
		log.Println("Unable to retrieve files ", err)
		return err
	}
	parentFolderId := ""
	if len(res.Files) == 0 {
		// create folder
		f := &drive.File{Name: invoiceUpload.Month, Parents: []string{invoiceFolderID}, MimeType: "application/vnd.google-apps.folder"}
		res, err := gDriveService.Files.Create(f).Do()
		if err != nil {
			log.Fatalf("Could not create dir: %v", err)
			return err
		}
		log.Printf("Dir '%s' successfully created.", res.Name)
		parentFolderId = res.Id
	} else {
		log.Printf("Folder '%s' already exists.", invoiceUpload.Month)
		parentFolderId = res.Files[0].Id
	}
	file := &drive.File{Name: invoiceUpload.Name, OriginalFilename: invoiceUpload.ID, Parents: []string{parentFolderId}, MimeType: "application/pdf", Properties: map[string]string{"invoice": invoiceUpload.ID, "do": "done"}}
	// create io reader invoiceUpload.File
	reader := strings.NewReader(invoiceUpload.File)

	r, err := gDriveService.Files.Create(file).Media(reader).Do()
	if err != nil {
		log.Fatalf("Unable to create file: %v", err)
		return err
	}
	log.Printf("File '%s', '%s', successfully uploaded.", r.Name, r.Id)
	return nil
}

type InvoiceUpload struct {
	ID    string `json:"id" form:"id" query:"id"`
	Name  string `json:"name" form:"name" query:"name"`
	File  string `json:"file" form:"file" query:"file"`
	Month string `json:"month" form:"month" query:"month"`
}

func getClient(config *oauth2.Config) *http.Client {
	// The file token.json stores the user's access and refresh tokens, and is
	// created automatically when the authorization flow completes for the first
	// time.
	tokFile := "token.json"
	tok, err := tokenFromFile(tokFile)
	if err != nil {
		tok = getTokenFromWeb(config)
		saveToken(tokFile, tok)
	}
	return config.Client(context.Background(), tok)
}

// Request a token from the web, then returns the retrieved token.
func getTokenFromWeb(config *oauth2.Config) *oauth2.Token {
	authURL := config.AuthCodeURL("state-token", oauth2.AccessTypeOffline)
	fmt.Printf("Go to the following link in your browser then type the "+
		"authorization code: \n%v\n", authURL)

	var authCode string
	if _, err := fmt.Scan(&authCode); err != nil {
		log.Fatalf("Unable to read authorization code %v", err)
	}

	tok, err := config.Exchange(context.TODO(), authCode)
	if err != nil {
		log.Fatalf("Unable to retrieve token from web %v", err)
	}
	return tok
}

// Retrieves a token from a local file.
func tokenFromFile(file string) (*oauth2.Token, error) {
	f, err := os.Open(file)
	if err != nil {
		return nil, err
	}
	defer f.Close()
	tok := &oauth2.Token{}
	err = json.NewDecoder(f).Decode(tok)
	return tok, err
}

// Saves a token to a file path.
func saveToken(path string, token *oauth2.Token) {
	fmt.Printf("Saving credential file to: %s\n", path)
	f, err := os.OpenFile(path, os.O_RDWR|os.O_CREATE|os.O_TRUNC, 0o600)
	if err != nil {
		log.Fatalf("Unable to cache oauth token: %v", err)
	}
	defer f.Close()
	json.NewEncoder(f).Encode(token)
}
