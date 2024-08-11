package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"invoicer"
)

func main() {
	log.Println("invoicer starting ", invoicer.Version)
	app, err := setupAndRun()
	if err != nil {
		log.Println(err)
		os.Exit(1)
	}
	if err := app.Start(); err != nil {
		log.Fatal(err)
	}

}

func setupAndRun() (*pocketbase.PocketBase, error) {
	app := pocketbase.New()

	// ---------------------------------------------------------------
	// Optional plugin flags:
	// ---------------------------------------------------------------

	var publicDir string
	app.RootCmd.PersistentFlags().StringVar(
		&publicDir,
		"publicDir",
		defaultPublicDir(),
		"the directory to serve static files",
	)
	var queryTimeout int
	app.RootCmd.PersistentFlags().IntVar(
		&queryTimeout,
		"queryTimeout",
		3,
		"the default SELECT queries timeout in seconds",
	)

	app.RootCmd.ParseFlags(os.Args[1:])

	// ---------------------------------------------------------------
	// Plugins and hooks:
	// ---------------------------------------------------------------

	app.OnAfterBootstrap().Add(func(e *core.BootstrapEvent) error {
		app.Dao().ModelQueryTimeout = time.Duration(queryTimeout) * time.Second
		return nil
	})

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		// serves static files from the provided public dir (if exists)
		e.Router.POST("/upload", func(c echo.Context) error {
			log.Println("uploading file")
			var invoiceUpload invoicer.InvoiceUpload

			if err := c.Bind(&invoiceUpload); err != nil {
				log.Println("error decoding invoiceUpload: ", err)
				return c.JSON(http.StatusBadRequest, "error decoding invoiceUpload")
			}
			gds, err := invoicer.SetupGDrive("credentials.json")
			if err != nil {
				log.Println("failed to setup gdrive ", err)
				return c.JSON(http.StatusInternalServerError, "failed setting up gdrive")
			}

			if err := invoicer.HandleFileUpload(&invoiceUpload, gds); err != nil {
				log.Println("failed handling upload", err)
				return c.JSON(http.StatusInternalServerError, "failed uploading")
			}
			return c.JSON(http.StatusOK, "ok")
		})
		// app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.GET("/test", func(c echo.Context) error {
			return c.JSON(http.StatusOK, "ok")
		})
		// serves static files from the provided public dir (if exists)

		e.Router.GET("*", apis.StaticDirectoryHandler(os.DirFS(publicDir), false))
		return nil
	})

	return app, nil
}

// the default pb_public dir location is relative to the executable
func defaultPublicDir() string {
	if strings.HasPrefix(os.Args[0], os.TempDir()) {
		// most likely ran with go run
		return "./pb_public"
	}
	return filepath.Join(os.Args[0], "../pb_public")
}
