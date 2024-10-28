using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using System.Security.Claims;

namespace Internship.EDM.Infrastructure
{
    public class CustomUserClaimsPrincipalFactory : UserClaimsPrincipalFactory<User>
    {
        private readonly UserManager<User> _userManager;

        public CustomUserClaimsPrincipalFactory(UserManager<User> userManager, IOptions<IdentityOptions> optionsAccessor)
            : base(userManager, optionsAccessor)
        {
            _userManager = userManager;
        }

        protected override async Task<ClaimsIdentity> GenerateClaimsAsync(User user)
        {
            var identity = await base.GenerateClaimsAsync(user);

            // Add email claim
            var email = await _userManager.GetEmailAsync(user);
            if (!string.IsNullOrEmpty(email))
            {
                identity.AddClaim(new Claim(ClaimTypes.Email, email));
            }

            // Add the user's single role as a claim
            var role = (await _userManager.GetRolesAsync(user)).FirstOrDefault();
            if (!string.IsNullOrEmpty(role))
            {
                identity.AddClaim(new Claim(ClaimTypes.Role, role));
            }

            return identity;
        }
    }

}
