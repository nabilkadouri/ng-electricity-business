import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Une erreur inconnue est survenue !';

      // Différencie les erreurs client (réseau, problème de code) des erreurs serveur
      if (error.error instanceof ErrorEvent) {
        // Erreur côté client ou réseau
        errorMessage = `Erreur côté client: ${error.error.message}`;
      } else {
        // Erreur côté serveur (statut HTTP comme 404, 500, etc.)
        errorMessage = `Erreur côté serveur - Code: ${error.status}\nMessage: ${error.message}`;
        // Tente de récupérer un message d'erreur plus spécifique si le backend en fournit un
        if (error.error && error.error.message) {
          errorMessage += `\nMessage du serveur: ${error.error.message}`;
        } else if (typeof error.error === 'string') {
          errorMessage += `\nCorps de l'erreur: ${error.error}`;
        } else {
          errorMessage += `\nCorps de l'erreur: ${JSON.stringify(error.error)}`;
        }
      }
      console.error(errorMessage); // Affiche l'erreur dans la console du navigateur

      // Ici, vous pourriez ajouter une logique pour afficher des messages à l'utilisateur
      // Par exemple, en utilisant un service de notification injectable (si nécessaire, car les intercepteurs fonctionnels peuvent les injecter via inject()).

      // Rejette l'erreur pour qu'elle puisse être capturée par les abonnements spécifiques si besoin.
      return throwError(() => new Error(errorMessage));
    })
  );
};
