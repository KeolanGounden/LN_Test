using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using System.Text.Json;

namespace ChangeTrackerModel.Models.Entities
{
    [Table("user")]
    public class UserEntity
    {
        [Key, Column("id")]
        public Guid Id { get; set; }
        /// <summary>
        /// The point at which the entity was created.
        /// </summary>
        [Column("created")]
        public DateTime Created { get; set; }
        /// <summary>
        /// The last point at which the entity was updated.
        /// </summary>
        [Column("updated")]
        public DateTime Updated { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [EmailAddress, Column("email")]
        public string Email { get; set; }

        [Column("password")]
        [JsonIgnore]
        public string Password { get; set; }

        [Column("salt")]
        [JsonIgnore]
        public string Salt { get; set; }

        [Column("notes")]
        public string Notes { get; set; }

        [Column("preferences")]
        public string PreferencesRaw { get; set; }

       
        [Column("keycloak_credentials_id")]
        public Guid? KeycloakCredentialsId { get; set; }
 

    }
}

